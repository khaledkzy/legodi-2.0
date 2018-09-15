const request = require('request')
const cheerio = require('cheerio')
const path = require('path')
var dir = path.join(__dirname, '../seeds/data')
var fs = require('fs')
let item = []
let link = []
let jsonData = []
let postHeading
let scrapedData = (title, category_id = 1, full_content, status = 'approved') => {
  let short_content = full_content.substring(0, 50)
  return { title, category_id, short_content, full_content, status }
}

var promise1 = new Promise(function (resolve, reject) {
  request('https://www.righttoremain.org.uk/toolkit/index.html', (error, response, html) => {
    if (!error && response.statusCode == 200) {
      resolve(html)
    }
  })
})

promise1.then(function (data) {
  const $ = cheerio.load(data, {
    normalizeWhitespace: true
  })
  let aTag = $('.accordion-content').find('div.row').find('.medium-3.columns').find('a')
  aTag.each((i, e) => {
    item.push($(e).text().trim())
    link.push($(e).attr('href'))
  })
  var links = link.map(link => `https://www.righttoremain.org.uk/toolkit/${link}`)

  links.map((x, i) => request(`${x}`, (error, response, page) => {
    var promise2 = new Promise(function (resolve, reject) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(page, {
          normalizeWhitespace: true
        })
        postHeading = $('.callout').text()
        var returnedData = scrapedData(item[i], undefined, postHeading)
        jsonData.push(returnedData)
        resolve(jsonData)
      }
    })
    promise2.then(function (json) {
      let stringFiy = JSON.stringify(json, null, 4)
      fs.writeFile(dir + '/rightToremain.json', stringFiy, (err) => {
        if (err) throw err
      })
    })
  }))
})
