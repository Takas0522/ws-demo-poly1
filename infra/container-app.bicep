// =============================================================================
// Frontend Container App モジュール
// =============================================================================
//
// Next.js フロントエンドアプリケーションの Container App を定義します。
// BFF (Backend for Frontend) としてバックエンドサービスへのプロキシ機能を提供します。
// =============================================================================

@description('環境名 (dev, staging, production)')
param environment string

@description('リージョン')
param location string

@description('タグ')
param tags object

// --- 依存リソースからの入力 ---

@description('Container Apps Environment の ID')
param containerAppsEnvironmentId string

@description('Container Registry のログインサーバー')
param containerRegistryLoginServer string

@description('Container Registry 名')
param containerRegistryName string

@description('Application Insights 接続文字列')
param appInsightsConnectionString string

@description('Auth Service の FQDN')
param authServiceFqdn string

@description('Tenant Service の FQDN')
param tenantServiceFqdn string

@description('Service Setting Service の FQDN')
param serviceSettingServiceFqdn string

// --- EasyAuth (Entra ID) 設定 ---

@description('Entra ID アプリケーション (クライアント) ID')
param entraClientId string

@secure()
@description('Entra ID クライアントシークレット')
param entraClientSecret string

@description('Entra ID テナント ID')
param entraTenantId string

// --- スケーリング設定 ---

@description('最小レプリカ数')
param minReplicas int = 0

@description('最大レプリカ数')
param maxReplicas int = 3

// --- CPU/メモリ設定 ---

@description('コンテナの CPU コア数')
param containerCpu string = '0.25'

@description('コンテナのメモリ (Gi)')
param containerMemory string = '0.5Gi'

// -----------------------------------------------------------------------------
// Frontend Container App (Next.js)
// -----------------------------------------------------------------------------
resource frontendApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: 'ca-frontend-${environment}'
  location: location
  tags: union(tags, { Service: 'frontend' })
  properties: {
    managedEnvironmentId: containerAppsEnvironmentId
    configuration: {
      activeRevisionsMode: 'Single'
      ingress: {
        external: true
        targetPort: 3000
        transport: 'http'
        allowInsecure: false
      }
      registries: [
        {
          server: containerRegistryLoginServer
          username: containerRegistryName
          passwordSecretRef: 'acr-password'
        }
      ]
      secrets: [
        {
          name: 'acr-password'
          value: listCredentials(resourceId('Microsoft.ContainerRegistry/registries', containerRegistryName), '2023-07-01').passwords[0].value
        }
        {
          name: 'microsoft-provider-authentication-secret'
          value: entraClientSecret
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'frontend'
          image: '${containerRegistryLoginServer}/frontend:latest'
          env: [
            { name: 'NODE_ENV', value: 'production' }
            { name: 'PORT', value: '3000' }
            { name: 'HOSTNAME', value: '0.0.0.0' }
            { name: 'AUTH_SERVICE_URL', value: 'https://${authServiceFqdn}' }
            { name: 'TENANT_SERVICE_URL', value: 'https://${tenantServiceFqdn}' }
            { name: 'SERVICE_SETTING_URL', value: 'https://${serviceSettingServiceFqdn}' }
            { name: 'APPLICATIONINSIGHTS_CONNECTION_STRING', value: appInsightsConnectionString }
          ]
          resources: {
            cpu: json(containerCpu)
            memory: containerMemory
          }
        }
      ]
      scale: {
        minReplicas: minReplicas
        maxReplicas: maxReplicas
        rules: [
          {
            name: 'http-scaling'
            http: {
              metadata: {
                concurrentRequests: '50'
              }
            }
          }
        ]
      }
    }
  }
}

// -----------------------------------------------------------------------------
// EasyAuth (Entra ID 認証) 設定
// -----------------------------------------------------------------------------
resource authConfig 'Microsoft.App/containerApps/authConfigs@2023-05-01' = {
  parent: frontendApp
  name: 'current'
  properties: {
    platform: {
      enabled: true
    }
    globalValidation: {
      unauthenticatedClientAction: 'RedirectToLoginPage'
    }
    identityProviders: {
      azureActiveDirectory: {
        registration: {
          clientId: entraClientId
          clientSecretSettingName: 'microsoft-provider-authentication-secret'
          openIdIssuer: 'https://sts.windows.net/${entraTenantId}/v2.0'
        }
        validation: {
          allowedAudiences: [
            'api://${entraClientId}'
          ]
        }
      }
    }
  }
}

// -----------------------------------------------------------------------------
// Outputs
// -----------------------------------------------------------------------------
output fqdn string = frontendApp.properties.configuration.ingress.fqdn
output name string = frontendApp.name
