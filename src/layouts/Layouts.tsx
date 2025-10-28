export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div style={{ direction: 'rtl' }} className="w-full  max-w-[420px]">
			{children}
		</div>
	);
}
