import { cn } from "@/lib/utils";
import { DashBoardShellProps } from "@/types";

const DashBoardShell = ({
  children,
  className,
  ...props
}: DashBoardShellProps) => {
  return (
    <div className={cn("grid items-center gap-8 pt-5", className)} {...props}>
      {children}
    </div>
  );
};

export default DashBoardShell;
