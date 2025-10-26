export default function Layout({ children }: any) {
	return (
		<div style={{ direction: 'rtl' }} className="w-[320px] sm:w-[450px]">
			{children}
		</div>
	);
}
