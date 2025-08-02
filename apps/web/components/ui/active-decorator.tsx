import { cn } from "@/lib/utils";

interface ActiveDecoratorProps {
  className?: string;
  isActive?: boolean;
}

export const ActiveDecorator = ({
  className,
  isActive = false,
}: ActiveDecoratorProps) => {
  if (!isActive) return null;

  return (
    <>
      <span
        className={cn(
          "absolute -left-px -top-px block size-2 border-l-2 border-t-2 border-primary",
          className
        )}
      ></span>
      <span
        className={cn(
          "absolute -right-px -top-px block size-2 border-r-2 border-t-2 border-primary",
          className
        )}
      ></span>
      <span
        className={cn(
          "absolute -bottom-px -left-px block size-2 border-b-2 border-l-2 border-primary",
          className
        )}
      ></span>
      <span
        className={cn(
          "absolute -bottom-px -right-px block size-2 border-b-2 border-r-2 border-primary",
          className
        )}
      ></span>
    </>
  );
};
