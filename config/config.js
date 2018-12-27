const env = process.env.NODE_ENV || 'developement';
if(env === 'developement'){
    const config =  require('./config.json');
    const configenv  = config[env];
    Object.keys(configenv).forEach((key)=>{
        process.env[key] = configenv[key];
    });
    console.log(process.env);
}