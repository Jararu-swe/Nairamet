// Simple test script to verify the enhanced scraper
const { fetchFeeds } = require('./lib/scraper.ts');

async function testScraper() {
  console.log('🧪 Testing enhanced scraper...');
  
  try {
    const testFeeds = [
      "https://www.vanguardngr.com/feed/",
      "https://punchng.com/feed/"
    ];
    
    const articles = await fetchFeeds(testFeeds, true);
    
    console.log(`✅ Scraped ${articles.length} articles`);
    
    if (articles.length > 0) {
      const sample = articles[0];
      console.log('\n📄 Sample article:');
      console.log(`Title: ${sample.title}`);
      console.log(`Source: ${sample.source}`);
      console.log(`Relevance Score: ${sample.relevanceScore}`);
      console.log(`Has Content: ${sample.content ? 'Yes' : 'No'}`);
      console.log(`Category: ${sample.category || 'N/A'}`);
    }
    
    const highRelevance = articles.filter(a => a.relevanceScore && a.relevanceScore > 3);
    console.log(`\n🎯 High relevance articles: ${highRelevance.length}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testScraper();