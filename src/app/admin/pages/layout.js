// components/Layout.js
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Layout = ({ children, setActiveComponent }) => {
  return (
    <div className="flex flex-row">
      <Sidebar setActiveComponent={setActiveComponent} />
      <div className="flex flex-col w-full">
        <Header />
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
