import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Preview - Script Market',
  description: 'View live product demonstrations',
};

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      {children}
    </div>
  );
}
