# benchmarks

> Please note `/graphiql` is only available if `NODE_ENV` is `development`

```sh
ab -k -c 100 -n 30000 "http://localhost:3000/graphql?query=%7B%0A%20%20hotel(id%3A%20%2219%22)%20%7B%0A%20%20%20%20id%0A%20%20%20%20name%0A%20%20%20%20ranking%20%7B%0A%20%20%20%20%20%20totalMark%0A%20%20%20%20%20%20totalPoll%0A%20%20%20%20%20%20avg%0A%20%20%20%20%7D%0A%20%20%20%20pictures(limit%3A%204)%20%7B%0A%20%20%20%20%20%20id%0A%20%20%20%20%20%20url%0A%20%20%20%20%7D%0A%20%20%20%20rooms%20%7B%20name%2C%20bedType%2C%20view%2C%20conveniences%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%7D%20%7D%0A%20%20%7D%0A%7D%0A"
```

## Result

```
Concurrency Level:      100
Time taken for tests:   16.733 seconds
Complete requests:      30000
Failed requests:        0
Keep-Alive requests:    30000
Total transferred:      41700000 bytes
HTML transferred:       37680000 bytes
Requests per second:    1792.88 [#/sec] (mean)
Time per request:       55.776 [ms] (mean)
Time per request:       0.558 [ms] (mean, across all concurrent requests)
Transfer rate:          2433.70 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.2      0       5
Processing:    14   56  15.5     53     151
Waiting:       14   56  15.5     53     151
Total:         14   56  15.6     53     151

Percentage of the requests served within a certain time (ms)
  50%     53
  66%     58
  75%     63
  80%     65
  90%     74
  95%     87
  98%    102
  99%    109
 100%    151 (longest request)
```

## Profiling

- Using `node --prof index.js` to run app
- Using `ab` like above
- `node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > processed.txt`
