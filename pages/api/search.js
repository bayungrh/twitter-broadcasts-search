import rp from 'request-promise';

export default (req, res) => {
  const query = req.query.query;
  const limit = 100;
  return rp({
    uri: `https://api.twitter.com/2/tweets/search/recent?query=${decodeURIComponent(query)}&tweet.fields=author_id,created_at,entities,geo,in_reply_to_user_id,lang,possibly_sensitive,referenced_tweets,source&max_results=${limit}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
    },
    json: true
  })
  .then((data) => {
    const datas = data.data;
    const filter = datas.filter((d) => {
      const isRetweeted = d.referenced_tweets && d.referenced_tweets[0].type === 'retweeted';

      if (d.entities && d.entities.urls && d.entities.urls.length > 0) {
        const filterBroadcast = d.entities.urls.find((u) => {
          return u.expanded_url.includes('/broadcasts/');
        });

        return (filterBroadcast && !isRetweeted);
      } 
      return false;
    });
    return filter;
  })
  .then((data) => res.json(data));
}