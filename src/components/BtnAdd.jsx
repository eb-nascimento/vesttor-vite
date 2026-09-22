import { Plus } from "lucide-react";

function BtnAdd({ onClick, texto }) {
  return (
    <button className="btn-nova-transacao" onClick={onClick}>
      <Plus size={16} aria-hidden="true" />
      {texto}
    </button>
  );
}
export default BtnAdd;
