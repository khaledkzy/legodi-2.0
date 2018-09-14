const request = require('request')
const cheerio = require('cheerio')
var fs = require('fs')

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
          const postHeading = $('.callout').text()
          let scrapedData = (title, category = 'asylum', fullContent) => {
            let shortContent = fullContent.substring(0, 50)
            return { title, category, shortContent, fullContent }
          }
          var data = scrapedData(item, undefined, postHeading)
          let parsedJson = JSON.stringify(data)
          fs.appendFile(__dirname + '/crawlData.js', parsedJson, (err) => {
            if (err) throw err
            console.log('Article Saved !! >>> ', item)
          })
        }
      })
    })
  }
})
