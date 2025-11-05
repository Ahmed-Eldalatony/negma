import { useEffect } from 'react';
import { useStore } from '@/hooks/useStoreData';
import { hexToHsl } from '@/lib/utils';

export default function AccentColorSetter() {
	const { storedData } = useStore();

	useEffect(() => {
		if (storedData?.settings?.color) {
			const hslColor = hexToHsl(storedData.settings.color);

			// Set the CSS custom properties for primary colors (used by buttons)
			document.documentElement.style.setProperty('--primary', `hsl(${hslColor})`);
			document.documentElement.style.setProperty('--primary-foreground', 'hsl(0 0% 98%)');

			// For dark mode, we might want to adjust the foreground color
			const isDark = document.documentElement.classList.contains('dark');
			if (isDark) {
				// In dark mode, if the primary is light, use dark foreground
				const lightness = parseInt(hslColor.split(' ')[2].replace('%', ''));
				if (lightness > 50) {
					document.documentElement.style.setProperty('--primary-foreground', 'hsl(0 0% 9%)');
				}
			}
		}
	}, [storedData]);

	return null; // This component doesn't render anything
}
