
export default function Layout({ children }: any) {
  return (
      <div style={{"direction":"rtl"}} className="max-w-md ">
 {children}
    </div>
  );
}
