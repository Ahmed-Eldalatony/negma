import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import type { Category } from '@/hooks/useCategory';

interface SearchFilterProps {
	searchText: string;
	onSearchTextChange: (value: string) => void;
	selectedCategoryId: string;
	onCategoryChange: (value: string) => void;
	categories: Category[] | null;
	onSearch: () => void;
}

export default function SearchFilter({
	searchText,
	onSearchTextChange,
	selectedCategoryId,
	onCategoryChange,
	categories,
	onSearch,
}: SearchFilterProps) {
	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			onSearch();
		}
	};

	return (
		<div className="relative">
			<Button
				onClick={onSearch}
				size="icon"
				variant="default"
				className="absolute left-1 top-1/2 rounded-lg -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted z-10"
			>
				<Search className="h-4 w-4" />
			</Button>
			<Input
				placeholder="البحث في المنتجات..."
				value={searchText}
				onChange={(e) => onSearchTextChange(e.target.value)}
				onKeyDown={handleKeyPress}
				className="pl-12 py-5 pr-40"
			/>
			<div className="absolute right-1 top-1/2 -translate-y-1/2">
				<Select value={selectedCategoryId} onValueChange={onCategoryChange}>
					<SelectTrigger className="w-36 h-8 !bg-gray-100 border-0 bg-transparent hover:bg-muted focus:ring-0">
						<SelectValue placeholder="جميع التصنيفات" />
					</SelectTrigger>
					<SelectContent className="max-h-60 overflow-y-auto">
						<SelectItem value="all">جميع التصنيفات</SelectItem>
						{categories?.map((cat) => (
							<SelectItem key={cat.id} value={cat.id.toString()}>
								{cat.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
