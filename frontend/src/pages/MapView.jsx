import React, { useEffect, useState } from 'react';
import { Card, Spin, message, Button } from 'antd';
import axios from '../api/axios';

export default function MapView() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFacilities = () => {
    setLoading(true);
    axios.get('/facilities').then(res => {
      setFacilities(res.data);
    }).catch(() => {
      message.error('设施数据加载失败');
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  // 生成JS数组字符串，优先用数据库经纬度
  const markersJS = facilities.map((f, idx) => {
    const lng = (f.longitude !== undefined && f.longitude !== null) ? Number(f.longitude) : 113.2206 + 0.002 * (idx % 5);
    const lat = (f.latitude !== undefined && f.latitude !== null) ? Number(f.latitude) : 23.0997 + 0.002 * Math.floor(idx / 5);
    return `{
      position: [${lng}, ${lat}],
      name: "${(f.name || '').replace(/"/g, '\\"')}",
      info: "型号: ${(f.model || '').replace(/"/g, '\\"')}<br>位置: ${(f.location || '').replace(/"/g, '\\"')}<br>数量: ${f.quantity || ''}<br>状态: ${(f.status || '').replace(/"/g, '\\"')}"
    }`;
  }).join(',');

  return (
    <Card title="设施分布地图" style={{ height: '80vh' }}>
      <Button onClick={fetchFacilities} style={{ marginBottom: 16 }}>刷新数据</Button>
      {loading ? <Spin /> : (
        <iframe
          title="amap"
          srcDoc={`<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="initial-scale=1.0, user-scalable=no, width=device-width">
  <style>
    html,body,#container {width:100%;height:100%;margin:0;padding:0;}
  </style>
</head>
<body>
  <div id="container"></div>
  <script src="https://webapi.amap.com/maps?v=2.0&key=171a5f80225cff64d7524f031a2d516d"></script>
  <script>
    var map = new AMap.Map('container', {
      zoom: 16,
      center: [113.2206, 23.0997]
    });

    // 设施分布点数据
    var markers = [${markersJS}];

    markers.forEach(function(item) {
      var marker = new AMap.Marker({
        position: item.position,
        title: item.name,
        map: map
      });
      var infoWindow = new AMap.InfoWindow({
        content: '<b>' + item.name + '</b><br>' + item.info
      });
      marker.on('click', function() {
        infoWindow.open(map, marker.getPosition());
      });
    });
  </script>
</body>
</html>`}
          style={{ width: '100%', height: '70vh', border: 'none' }}
        />
      )}
    </Card>
  );
} 