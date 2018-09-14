const request = require('request')
const cheerio = require('cheerio')
let fullHtml
request('https://www.righttoremain.org.uk/toolkit/index.html', (error, response, html) => {
  if (!error && response.statusCode == 200) {
    const $ = cheerio.load(html, {
      normalizeWhitespace: true
    })
    $('.accordion-content').find('div.row').find('.medium-3.columns').find('a').each((index, element) => {
      const item = $(element).text().trim()
      const link = $(element).attr('href')
      request(`https://www.righttoremain.org.uk/toolkit/${link}`, (error, response, page) => {
        if (!error && response.statusCode == 200) {
          const $ = cheerio.load(page, {
            normalizeWhitespace: true
          })
          fullHtml = page
          const postHeading = $('.callout').text()
          let scrapedData = (title, category = 'asylum', fullContent) => {
            let shortContent = fullContent.substring(0, 50)
            return { title, category, shortContent, fullContent }
          }
          console.log(scrapedData(item, undefined, postHeading))
          console.log(fullHtml)
          return scrapedData(item, undefined, postHeading)
        }
      })
    })
  }
})
