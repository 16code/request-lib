import request from '../../src';

request.defaults.baseURL = 'http://localhost:9005/api';
request.defaults.auth = {
    username: 'admin',
    password: '123456'
}
const params = { id: 'id33 12', userName: '@userName' };

function addClass(el, cls) {
    if (el) {
        el.classList.add(cls);
    }
}
function removeClass(el, cls) {
    if (el) {
        el.classList.remove(cls);
    }
}

// request.defaults.timeout = 1000

async function init() {

    const loginForm = document.forms['login'];
    const downloadBufferForm = document.forms['downloadBufferForm'];
    const uploadBufferForm = document.forms['uploadBufferForm'];
    const longRequest = document.querySelector('#longRequest');
    const cancelRequest = document.querySelector('#cancelRequest');


    longRequest.onclick = async (event) => {
        const el = event.currentTarget;
        const controller = new AbortController();
        addClass(el, 'is-loading');
        cancelRequest.onclick = () => {
            controller.abort()
        }
        request('./long-request', {
            method: 'GET',
            signal: controller.signal,
        })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                removeClass(el, 'is-loading');
            })        
    }

    loginForm.onsubmit = async event => {
        event.preventDefault()
        await request('/file', {
            method: 'POST',
            data: loginForm,
        });
    }
    uploadBufferForm.onsubmit = async event => {
        event.preventDefault();
        const file = uploadBufferForm.querySelector('input[name="buffer"]').files[0];

        const buffer = await file.arrayBuffer();
        await request('/file', {
            method: 'PUT',
            data: buffer,
            headers: {
                'x-file-name': file.name,
                'x-file-type': file.type,
                'Content-Type': 'application/octet-stream',
            }
        });
    }

    downloadBufferForm.onsubmit = async event => {
        event.preventDefault();
        await request('/file?filename=:fileName', {
            method: 'get',
            params: event.currentTarget || new FormData(event.currentTarget),
            responseType: 'arraybuffer'
        }).then(response => {
            const cd = response.headers.getContentDisposition();
            if (cd) {
                const filename = cd.split(';').pop().trim();
                console.log(filename);
           }
            const blob = new Blob([response.data], {
                type: 'image/webp'
            });
            const img = new Image();
            img.src = URL.createObjectURL(blob);
            document.body.appendChild(img)

        })
    }

    const file = document.querySelector('input[name="file"]');
    file.onchange = async event => {
        const fd = new FormData();
        fd.append('file', event.target.files[0])
        await request('/file', {
            method: 'post',
            data: fd,
            onUploadProgress: progress => {
                console.log(progress);
            }
        })
    }

    // const bufferEl = document.querySelector('input[name="buffer"]');
    // bufferEl.onchange = async event => {
    //     const buffer = await event.target.files[0].arrayBuffer()
    //     console.log(buffer);
    //     await request('/file', {
    //         method: 'post',
    //         data: buffer,
    //         headers: {
    //            'Content-Type' : 'application/octet-stream'
    //         },
    //         onUploadProgress: progress => {
    //             console.log(progress);
    //         }
    //     })
    // }




    // const urlParams = new URLSearchParams(params);
    // const response = await request('/all/:id/profile?userName=:userName', {
    //     method: 'POST',
    //     params: params,
    //     data: { userName: 'lau Jerry', userAge: 18 },
    // });
    // console.log('response', response);
}

init();

