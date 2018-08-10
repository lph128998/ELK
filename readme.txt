https://www.elastic.co/guide/en/elastic-stack/current/installing-elastic-stack.html
https://www.elastic.co/guide/en/elastic-stack-overview/6.3/get-started-elastic-stack.html#install-beats
https://www.elastic.co/guide/en/beats/filebeat/6.3/filebeat-getting-started.html

#启动ES
配置ES_HOME
cd /Users/liupeihua/Documents/ELK/elasticsearch-6.3.2/bin
./elasticsearch -d -p pid
检测：curl http://127.0.0.1:9200

#启动logstash
cd /Users/liupeihua/Documents/ELK/logstash-6.3.2/bin
nohup ./logstash -f ../config/logstash.conf &
http://localhost:5044

#启动Beats（收集json文件）
cd /Users/liupeihua/Documents/ELK/filebeat-6.3.2-darwin-x86_64
./filebeat -e -c filebeat.yml -d "publish"

#启动kibana
配置KIBANA_HOME
cd /Users/liupeihua/Documents/ELK/kibana-6.3.2-darwin-x86_64/bin
nohup ./kibana &
检测http://127.0.0.1:5601



