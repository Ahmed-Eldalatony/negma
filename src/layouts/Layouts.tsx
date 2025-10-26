export default function Layout({ children }: any) {
	return (
		<div style={{ direction: 'rtl' }} className="w-[450px] px-2">
			{children}
		</div>
	);
}
