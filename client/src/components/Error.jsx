export default function ErrorMsg({ msg }) {
  return (
    <div className="flex items-center gap-2 bg-red-50 text-red-600 
                    border border-red-200 px-4 py-2 rounded-lg text-sm">
      <span>⚠️</span>
      <p>{msg}</p>
    </div>
  );
}