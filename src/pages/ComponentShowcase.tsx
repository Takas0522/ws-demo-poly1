import React, { useState } from 'react';
import {
  Button,
  Input,
  Modal,
  Table,
  Card,
  Badge,
  Tabs,
  Breadcrumb,
  Dropdown,
  Alert,
  Spinner,
  TableSkeleton,
  CardSkeleton,
  FormSkeleton,
  EmptyState,
} from '../components/ui';
import { useToast } from '../contexts/ToastContext';

/**
 * Component showcase page demonstrating all UI components
 * This is for development/documentation purposes
 */
export const ComponentShowcase: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const toast = useToast();

  const tableData = [
    { id: 1, name: 'John Doe', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', role: 'Editor', status: 'Active' },
    { id: 3, name: 'Bob Johnson', role: 'Viewer', status: 'Inactive' },
  ];

  const tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
  ];

  const tabs = [
    { id: 'tab1', label: 'Tab 1', content: <div>Content for Tab 1</div> },
    { id: 'tab2', label: 'Tab 2', content: <div>Content for Tab 2</div> },
    { id: 'tab3', label: 'Tab 3', content: <div>Content for Tab 3</div> },
  ];

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Components', href: '/components' },
    { label: 'Showcase' },
  ];

  const dropdownItems = [
    { label: 'Profile', onClick: () => alert('Profile clicked') },
    { label: 'Settings', onClick: () => alert('Settings clicked') },
    { label: 'Logout', onClick: () => alert('Logout clicked') },
  ];

  return (
    <div className="p-8 space-y-12 max-w-7xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">UI Component Showcase</h1>
        <p className="text-gray-600">A comprehensive demonstration of all available UI components</p>
      </div>

      {/* Breadcrumb */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Breadcrumb</h2>
        <Breadcrumb items={breadcrumbItems} />
      </section>

      {/* Buttons */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Buttons</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="ghost">Ghost</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>
      </section>

      {/* Badges */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Badges</h2>
        <div className="flex flex-wrap gap-4">
          <Badge variant="default">Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </section>

      {/* Alerts */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Alerts</h2>
        <div className="space-y-4">
          <Alert variant="info">
            This is an informational alert message.
          </Alert>
          <Alert variant="success">This is a success alert message.</Alert>
          <Alert variant="warning">This is a warning alert message.</Alert>
          <Alert variant="error">This is an error alert message.</Alert>
        </div>
      </section>

      {/* Toast Notifications */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Toast Notifications</h2>
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => toast.success('Success! Operation completed successfully')}>
            Show Success
          </Button>
          <Button onClick={() => toast.error('Error! Something went wrong')} variant="danger">
            Show Error
          </Button>
          <Button onClick={() => toast.warning('Warning! Please check your input')} variant="secondary">
            Show Warning
          </Button>
          <Button onClick={() => toast.info('Info: New updates available')} variant="ghost">
            Show Info
          </Button>
        </div>
      </section>

      {/* Loading Skeletons */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading Skeletons</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">Table Skeleton</h3>
            <TableSkeleton rows={3} columns={4} />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Card Skeleton</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <CardSkeleton count={3} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Form Skeleton</h3>
            <div className="max-w-md">
              <FormSkeleton fields={4} />
            </div>
          </div>
        </div>
      </section>

      {/* Empty States */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Empty States</h2>
        <div className="space-y-8">
          <div className="border border-gray-200 rounded-lg">
            <EmptyState
              title="No items found"
              description="You haven't created any items yet. Get started by clicking the button below."
              action={{
                label: 'Create Item',
                onClick: () => toast.info('Create item clicked')
              }}
            />
          </div>
          <div className="border border-gray-200 rounded-lg">
            <EmptyState
              title="No results"
              description="Try adjusting your search or filter to find what you're looking for."
            />
          </div>
        </div>
      </section>

      {/* Input */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Input</h2>
        <div className="space-y-4 max-w-md">
          <Input label="Username" placeholder="Enter username" />
          <Input label="Email" type="email" helperText="We'll never share your email." />
          <Input label="Password" type="password" error="Password is required" />
        </div>
      </section>

      {/* Spinner */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Spinner</h2>
        <div className="flex gap-8 items-center">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
          <Spinner size="xl" />
        </div>
      </section>

      {/* Card */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card title="Simple Card">
            <p className="text-gray-600">This is a simple card with just a title and content.</p>
          </Card>
          <Card
            title="Card with Footer"
            footer={
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="secondary">Cancel</Button>
                <Button size="sm">Save</Button>
              </div>
            }
          >
            <p className="text-gray-600">This card has a footer with action buttons.</p>
          </Card>
          <Card>
            <p className="text-gray-600">This is a card without a title.</p>
          </Card>
        </div>
      </section>

      {/* Table */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Table</h2>
        <Card>
          <Table
            columns={tableColumns}
            data={tableData}
            onRowClick={(row) => alert(`Clicked row: ${row.name}`)}
          />
        </Card>
      </section>

      {/* Tabs */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tabs</h2>
        <Card>
          <Tabs tabs={tabs} />
        </Card>
      </section>

      {/* Dropdown */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Dropdown</h2>
        <div className="flex gap-4">
          <Dropdown
            trigger={<Button variant="secondary">Left Aligned</Button>}
            items={dropdownItems}
            align="left"
          />
          <Dropdown
            trigger={<Button variant="secondary">Right Aligned</Button>}
            items={dropdownItems}
            align="right"
          />
        </div>
      </section>

      {/* Modal */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Modal</h2>
        <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Example Modal">
          <div className="space-y-4">
            <p className="text-gray-600">
              This is a modal dialog. It can contain any content you want.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setModalOpen(false)}>Confirm</Button>
            </div>
          </div>
        </Modal>
      </section>
    </div>
  );
};

export default ComponentShowcase;
