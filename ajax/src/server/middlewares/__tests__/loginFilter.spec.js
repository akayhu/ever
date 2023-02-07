import Loginfilter from '../LoginFilter';

describe('plus login filter', () => {
    
    it('if url is from sso, should skip & next', (done) => {
        Loginfilter()(req, res, () => {
            done();
        });
    });

    it('')
})