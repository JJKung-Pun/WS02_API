function getURLParams(req)
{
    const baseURL = 'http://' + req.headers.host
    const reqUrl  = new URL(req.url, baseURL)
   
    return {
        baseURL,
        reqUrl,
        path    :  reqUrl.pathname,
    }
}
function collectBodyData(req)
{  
    let body = ""

    return new Promise( (resolve) => {
        req.on("data", (chunk) => {
            body = body + chunk.toString()
        })

        req.on("end", () => {
            try {
              const data = JSON.parse(body)
              resolve(data)
            }catch(excp){
                console.log(excp)
                resolve({})
            }
        })
    })
}
