import Limiter from 'ratelimiter';
import ms from 'ms';

export default (db, maxRequests, duration) => function limitNumberOfRequests(req, res, next) {
  const id = req.user._id;
  const limit = new Limiter({
    id,
    db,
    max: maxRequests,
    duration,
  });

  limit.get((err, limit) => {
    if (err) return next(err);

    res.set('X-RateLimit-Limit', limit.total);
    res.set('X-RateLimit-Remaining', limit.remaining);
    res.set('X-RateLimit-Reset', limit.reset);

    if (limit.remaining) return next();

    // not good
    const delta = (limit.reset * 1000 - Date.now()) || 0;
    const after = (limit.reset - Date.now() / 1000) || 0;
    res.set('Retry-After', after);
    res.send(
      429,
      `Rate limit exceeded, retry in ${ms(delta, {
        long: true,
      })}`,
    );
  });
};
