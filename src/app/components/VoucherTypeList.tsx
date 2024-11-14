type VoucherTypeListProps = {
    voucherTypes: any[];
    onEdit: (voucherType: any) => void;
    onDelete: (id: number) => void;
  };
  
  const VoucherTypeList: React.FC<VoucherTypeListProps> = ({
    voucherTypes,
    onEdit,
    onDelete,
  }) => {
    return (
      <div className="space-y-4">
        {voucherTypes.length > 0 ? (
          <ul>
            {voucherTypes.map((voucherType) => (
              <li
                key={voucherType.id}  
                className="flex justify-between items-center border-b py-2"
              >
                <div>
                  <h4 className="font-semibold text-lg">{voucherType.name}</h4>
                  <p className="text-sm text-gray-500">{voucherType.shortForm}</p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => onEdit(voucherType)}
                    className="text-blue-500 hover:text-blue-700 font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(voucherType.id)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No voucher types found.</p>
        )}
      </div>
    );
  };
  
  export default VoucherTypeList;
  