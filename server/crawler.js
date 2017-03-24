var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var async = require('async');
var db = require('./mysql');

function getCategories() {
  request.get('http://news.ifeng.com', (err, res, body)=> {
    const $ = cheerio.load(body);
    const cates = [];
    $('#fixed_box').children().each((i, v)=> {
      cates.push([i + 1, unescape($(v).html().replace(/&#x/g, '%u').replace(/;/g, ''))])
    });
    db.query('insert into categories (id,name) values ?', [cates], ()=> {
      console.log('分类写入成功..');
    })
  });
}
// getCategories();

function getNewsList() {
  request.get('http://news.ifeng.com', (err, res, body)=> {
    const $ = cheerio.load(body);
    const newsListEnt = JSON.parse($('#outer').parent().next().html().trim().slice(17));
    const newsList = JSON.parse($('#outer').parent().next().next().html().trim().slice(13, -1));
    newsList.splice(1, 0, newsListEnt);

    const newsData = [];
    newsList.forEach(function (cate, index) {
      cate.forEach((v, i)=> {
        var thumbnail;
        if (Array.isArray(v.thumbnail)) {
          thumbnail = v.thumbnail.join(',');
        } else {
          thumbnail = v.thumbnail;
        }
        var n = [thumbnail, v.title, v.url, index + 1];
        newsData.push(n);
      });
    });
    db.query('insert into news (thumbnail,title,url,cat_id) values ?', [newsData], ()=> {
      console.log('.....');
    });
  });
}
getNewsList();

// function getContent() {
//   db.query('select * from news where is_complete = ?', [0], (err, result)=> {
//     result.forEach((v, i)=> {
//       console.log(v.url, v.id);
//     });
//   });
// }
// function parsePage(url) {
//   request.get(url, (err, res, body)=> {
//     const $ = cheerio.load(body);
//     const publishTime = $('#artical_sth span[itemprop=datePublished]').html().replace(/&#[^;]+;/g, ' ');
//     const content = $('#main_content').html();
//     console.log(content);
//   });
// }
// getContent();
// parsePage('http://news.ifeng.com/a/20170214/50692293_0.shtml');

//-------------------------------------------------------------------------------------

// async.series({
//   one: function (callback) {
//     setTimeout(function () {
//       callback(null, 1)
//     })
//   },
//   two: function (callback) {
//     setTimeout(function () {
//       callback(null, 2)
//     })
//   }
// }, function (err, results) {
//   console.log(results);
// });
// return;
// var url = 'http://tieba.baidu.com/p/1081149546?see_lz=1&pn=';
//
// function get(url, fn) {
//   var data = [];
//   request.get(
//     {
//       headers: {
//         'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36',
//         'Cookie': 'userFromPsNeedShowTab=1; PSTM=1477787187; BIDUPSID=37E36A373395A5C4A1A696FF28C41F13; BAIDUCUID=++; TIEBA_USERTYPE=18f315077954ef1aa7dfa57b; pgv_pvi=3306425344; bdshare_firstime=1487080921680; BDUSS=WRuamRJOVJENlRxa0RUTTl6S2s4a2xULVN2fjd0SG9LRmpJZWRXOWFDYnhuTXBZSVFBQUFBJCQAAAAAAAAAAAEAAADU1IcHYWRtYV9hZG1hAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPEPo1jxD6NYV; STOKEN=44eab05f0dc38dc1cb0019ac11ebf6672484bbfaf793cd9b7d23811095fcccf7; TIEBAUID=a42b78eca0ed31238e02f212; Hm_lvt_287705c8d9e2073d13275b18dbd746dc=1487080924; Hm_lpvt_287705c8d9e2073d13275b18dbd746dc=1487081889; LONGID=126342356; wise_device=0; BAIDUID=CED81EA50894250EEC6FB11C58AD695A:FG=1'
//       },
//       url: url
//     },
//     function (err, res, body) {
//       var $ = cheerio.load(body);
//
//       $('.d_post_content.j_d_post_content').each(function (i, v) {
//
//         const imgSrc = $(v).find('img').attr('src');
//         const id = $(v).attr('id').split('_')[2];
//         console.log(imgSrc);
//         const o = {
//           id: id,
//           src: './images/' + id + '.jpg',
//           des: $(v).text().trim()
//         };
//         data.push(o);
//         // if (imgSrc) {
//         //   request
//         //     .get({
//         //       headers: {
//         //         'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36',
//         //         'Cookie': 'userFromPsNeedShowTab=1; PSTM=1477787187; BIDUPSID=37E36A373395A5C4A1A696FF28C41F13; BAIDUCUID=++; TIEBA_USERTYPE=18f315077954ef1aa7dfa57b; pgv_pvi=3306425344; bdshare_firstime=1487080921680; BDUSS=WRuamRJOVJENlRxa0RUTTl6S2s4a2xULVN2fjd0SG9LRmpJZWRXOWFDYnhuTXBZSVFBQUFBJCQAAAAAAAAAAAEAAADU1IcHYWRtYV9hZG1hAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPEPo1jxD6NYV; STOKEN=44eab05f0dc38dc1cb0019ac11ebf6672484bbfaf793cd9b7d23811095fcccf7; TIEBAUID=a42b78eca0ed31238e02f212; Hm_lvt_287705c8d9e2073d13275b18dbd746dc=1487080924; Hm_lpvt_287705c8d9e2073d13275b18dbd746dc=1487081889; LONGID=126342356; wise_device=0; BAIDUID=CED81EA50894250EEC6FB11C58AD695A:FG=1'
//         //       },
//         //       url: imgSrc
//         //     })
//         //     .on('error', function (err) {
//         //       console.log(err)
//         //     })
//         //     .pipe(fs.createWriteStream(__dirname + '/images/' + id + '.jpg'));
//         // }
//       });
//       fn(null, data);
//     }
//   );
// }
//
// async.parallel([
//   function (fn) {
//     get(url + 1, fn);
//   },
//   function (fn) {
//     get(url + 2, fn);
//   },
//   function (fn) {
//     get(url + 3, fn);
//   }
// ], function (err, res) {
//   res = res[0].concat(res[1]).concat(res[2]);
//
//   // 写入js文件
//   var js = JSON.stringify(res, null, 4);
//   fs.writeFile('./scripts/data.json', js, function (err) {
//     if (err) {
//       throw err;
//     }
//     console.log('saved!');
//   });
// });
