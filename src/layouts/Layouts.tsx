export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div style={{ direction: 'rtl' }} className="w-full  sm:w-[450px]">
			{children}
		</div>
	);
}
