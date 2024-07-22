import CreateBranchForm from './CreateBranchForm';

export default function BranchesPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Branches</h1>
      <CreateBranchForm />
    </div>
  );
}
