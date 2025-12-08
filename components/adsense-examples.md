# AdSense Component Usage Guide

## Setup

1. **Add your AdSense Client ID to `.env.local`:**
```env
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-1234567890123456
```

2. **Get Ad Slot IDs from AdSense Dashboard:**
   - Go to https://adsense.google.com
   - Create ad units
   - Copy the slot IDs

## Basic Usage

### 1. Standard Ad (Auto-sized)
```tsx
import { AdSense } from "@/components/adsense";

<AdSense 
  slot="1234567890"
  format="auto"
  responsive={true}
/>
```

### 2. In-Feed Ad (for blog lists)
```tsx
import { AdSenseInFeed } from "@/components/adsense";

<AdSenseInFeed 
  slot="1234567890"
  className="my-4"
/>
```

### 3. In-Article Ad (within content)
```tsx
import { AdSenseInArticle } from "@/components/adsense";

<AdSenseInArticle 
  slot="1234567890"
  className="my-6"
/>
```

### 4. Display Ad (fixed size banner)
```tsx
import { AdSenseDisplay } from "@/components/adsense";

<AdSenseDisplay 
  slot="1234567890"
  width={728}
  height={90}
  className="mx-auto"
/>
```

## Example Placements

### Landing Page (app/page.tsx)
```tsx
export default function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <section>...</section>
      
      {/* Ad after hero */}
      <AdSense slot="1234567890" className="my-8" />
      
      {/* Features Section */}
      <section>...</section>
      
      {/* Ad after features */}
      <AdSense slot="0987654321" className="my-8" />
    </div>
  );
}
```

### Blog Page (app/blog/page.tsx)
```tsx
export default function BlogPage() {
  return (
    <div>
      {articles.map((article, index) => (
        <>
          <ArticleCard article={article} />
          
          {/* Ad every 3 articles */}
          {(index + 1) % 3 === 0 && (
            <AdSenseInFeed 
              slot="1234567890" 
              className="my-6"
            />
          )}
        </>
      ))}
    </div>
  );
}
```

### Blog Article (app/blog/[id]/page.tsx)
```tsx
export default function ArticlePage() {
  return (
    <article>
      <h1>Article Title</h1>
      
      {/* Ad after title */}
      <AdSenseInArticle slot="1234567890" className="my-6" />
      
      <p>First paragraph...</p>
      <p>Second paragraph...</p>
      
      {/* Ad in middle of content */}
      <AdSenseInArticle slot="0987654321" className="my-6" />
      
      <p>More content...</p>
    </article>
  );
}
```

### Sidebar Ad
```tsx
<aside className="w-64">
  <AdSense 
    slot="1234567890"
    format="vertical"
    responsive={true}
    className="sticky top-4"
  />
</aside>
```

## Ad Formats

- **auto**: Responsive, adapts to container
- **rectangle**: Square/rectangular ads
- **vertical**: Tall vertical ads (sidebar)
- **horizontal**: Wide horizontal ads (banner)

## Best Practices

1. **Don't overload pages** - 3-4 ads per page maximum
2. **Space them out** - Use margins/padding between ads and content
3. **Mobile-friendly** - Use responsive ads
4. **Above the fold** - Place at least one ad in visible area
5. **Natural placement** - Integrate ads naturally into content flow

## Troubleshooting

**Ads not showing?**
- Check if `NEXT_PUBLIC_ADSENSE_CLIENT_ID` is set
- Verify slot IDs are correct
- Wait 24-48 hours after AdSense approval
- Check browser console for errors
- Disable ad blockers for testing

**Placeholder showing?**
- AdSense client ID not configured
- Add to `.env.local` and restart dev server
