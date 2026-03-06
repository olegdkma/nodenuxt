

export async function customFetch(endPoint, options={}) {
    options.credentials = 'include'


    try{
        let resp = await $fetch(endPoint, options)

        if(resp.status === 401) {
            console.log(123,4324)
            const refresh = await $fetch('http://localhost:3002/api/refresh', {
                credentials: 'include'
            })
            if(refresh.status !== 200) {
                window.location = '/admin/login'
                return
            }
            resp = await $fetch(endPoint, options)
        }
        return resp
    }catch (e) {
        if(e.status === 401) {
                console.log(123,4324)
                const refresh = await $fetch('http://localhost:3002/api/refresh', {
                    credentials: 'include',
                    method: 'POST'
                })
                if(refresh.message !== 'loged') {
                    window.location = '/admin/login'
                    return
                }
                return await $fetch(endPoint, options)
        }
    }
}