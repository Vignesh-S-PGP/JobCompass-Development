import { Search } from "lucide-react";
import Button from "./Button";

const EmptyState = ({
  title = "No results found",
  description = "Try adjusting your search or filters to find what you're looking for.",
  icon = <Search size={48} />,
  actionLabel,
  onAction,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center rounded-3xl border-2 border-dashed border-muted bg-muted/5 ${className}`}>
      <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center text-muted-foreground mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-8">{description}</p>
      {actionLabel && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
