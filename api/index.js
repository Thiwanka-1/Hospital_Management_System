import express from 'express';

const app =  express();

app.listen(3000, () => {
    console.log('Server listning on port 3000!')
});