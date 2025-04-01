import { DashBoardHeaderProps } from "@/types";

const DashboardHeader = ({ heading, text }: DashBoardHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="grid gap-1">
        <h1 className="font-extrabold text-3xl md:text-4xl">{heading}</h1>
        {text && <p className="text-lg text-muted-foreground">{text}</p>}
      </div>
    </div>
  );
};

export default DashboardHeader;
