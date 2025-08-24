# OpenGause 相关参考

## 本地部署

参考[官方网站](https://docs.opengauss.org/zh/docs/7.0.0-RC1/docs/InstallationGuide/%E5%AE%B9%E5%99%A8%E9%95%9C%E5%83%8F%E5%AE%89%E8%A3%85.html)

运行容器参考如下命令：
```bash
docker run --name opengauss --privileged=true -d -e GS_PASSWORD={your_pwd} -e GS_NODENAME=matrixaidb -e GS_USERNAME=matrixai -e GS_DB=matrixai -v {/you/path/to/backend/db }:/var/lib/opengauss -p 8888:5432 opengauss/opengauss-server:latest
```

密码要求：
```log
Error: The supplied GS_PASSWORD is not meet requirements.
Please Check if the password contains uppercase, lowercase, numbers, special characters, and password length(8).
At least one uppercase, lowercase, numeric, special character.
Example: Enmo@123
```

## Navicat 连接

注意是新建 PostgreSQL 连接，根据自己的命令填写即可