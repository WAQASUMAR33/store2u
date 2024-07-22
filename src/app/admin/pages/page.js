// pages/admin/index.js
'use client';
import { useState } from 'react';
import Layout from '../../components/Layout';
import BranchesPage from '../branches/page';

const AdminPage = () => {
  const [activeComponent, setActiveComponent] = useState('branches');

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'branches':
        return <BranchesPage />;
      // Add other cases for different components
      default:
        return <div>Welcome to the Admin Panel</div>;
    }
  };

  return (
    <Layout setActiveComponent={setActiveComponent}>
      {renderActiveComponent()}
    </Layout>
  );
};

export default AdminPage;
