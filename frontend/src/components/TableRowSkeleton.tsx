import { TableCell, TableRow } from "./ui/table";
import { Skeleton } from "./ui/skeleton";

const TableRowSkeleton = ({ columns }: { columns: number }) => {
  return (
    <TableRow>
      {Array.from({ length: columns }).map((_, index) => (
        <TableCell key={index}>
          <Skeleton className="h-4 w-[50px] ml-auto mr-auto" />
        </TableCell>
      ))}
    </TableRow>
  );
};

export default TableRowSkeleton;
