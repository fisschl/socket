$image = "registry.cn-shanghai.aliyuncs.com/fisschl/socket:latest"

docker build -t $image .
docker push $image
