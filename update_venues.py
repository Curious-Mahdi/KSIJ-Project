import os
import re

venues_page_path = r'c:\Users\ASUS\OneDrive\Desktop\KSIJ\src\app\(app)\venues\page.tsx'

with open(venues_page_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace imports
content = content.replace(
    'import { getMarketplaceListings, getCommunityProperties } from "@/lib/actions/marketplace";',
    'import { getCommunityProperties } from "@/lib/actions/marketplace";'
)

# Remove member listings fetching
content = content.replace(
    'const memberListings = await getMarketplaceListings();',
    ''
)

# Change title and texts
content = content.replace('export default async function MarketplacePage() {', 'export default async function VenuesPage() {')
content = content.replace('MARKETPLACE', 'VENUES')
content = content.replace('Discover the community.', 'Community Venues')
content = content.replace('Discover community spaces, properties and items available within the community.', 'Explore and book official Jamaat venues, halls, and community spaces for your upcoming events.')

# Search form
content = content.replace('action="/marketplace/search"', 'action="/venues/search"')
content = content.replace('placeholder="Search properties, venues, vehicles, electronics and more..."', 'placeholder="Search venues, halls, and facilities..."')

# Section Header
content = content.replace('Community Properties', 'Jamaat Venues')
content = content.replace('Explore venues and facilities managed by the Jamaat and community organizations.', 'Official halls, banquets, and spaces managed by the Jamaat.')
content = content.replace('href="/marketplace/community-properties"', 'href="/venues"')
content = content.replace('Explore Community Properties', 'View All Venues')

# Links
content = content.replace('href={`/marketplace/community-properties/${prop.id}`}', 'href={`/venues/${prop.id}`}')

# Remove Member Marketplace section entirely
member_section_regex = re.compile(r'\{\/\* Member Marketplace Section \*\/\}.*?<\/section>', re.DOTALL)
content = member_section_regex.sub('', content)

# Remove floating action button
fab_regex = re.compile(r'<Link href="/marketplace/list-something" className=\{styles\.floatingActionButton\}>.*?</Link>', re.DOTALL)
content = fab_regex.sub('', content)

with open(venues_page_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated venues/page.tsx successfully.")
