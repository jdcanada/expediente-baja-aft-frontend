interface NavigationItem {
  label: string;
  icon: string;
  route: string;
  tooltip?: string;
  permission?: string;
}

interface NavigationGroup {
  title: string;
  icon: string;
  items: NavigationItem[];
}
