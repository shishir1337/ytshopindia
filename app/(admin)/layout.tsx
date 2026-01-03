export default function AdminGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Route group layout - no header/footer for admin routes
  // This layout only wraps children, root layout handles html/body
  return <>{children}</>;
}

