import { ReactNode } from "react";

interface ResponsiveTableWrapperProps {
  children: ReactNode;
}

export function ResponsiveTableWrapper({
  children,
}: ResponsiveTableWrapperProps) {
  return (
    <div className="w-full overflow-x-auto -mx-4 sm:mx-0">
      <div className="inline-block min-w-full align-middle px-4 sm:px-0">
        {children}
      </div>
    </div>
  );
}

