import { List } from 'antd';
import {useEffect, useState} from 'react';
import API from '../../configs/api';
import PaginationCustom from '../../components/PaginationCustom';
import {FIRST_PAGE, FIRST_SIZE} from '../../utilities/constant';
import {video} from '../../ts/interface';
import {HTTP_STATUS_CODE} from '../../ts/enums';

const Home = () => {

  const [page, setPage] = useState(FIRST_PAGE);
  const [size, setSize] = useState(FIRST_SIZE);
  const [totalRecord, setTotalRecord] = useState();
  const [listVideo, setListVideo] = useState();


  useEffect(() => {
    API.getListVideo(page, size).then((response: any) => {
      console.log(response)
      if (response.status === HTTP_STATUS_CODE.OK) {

        const formatDataVideos = response.data.data.map((record: video) => {

          return {
            title: record.title,
            sharedBy: record.sharedBy,
            videoUrl: record.videoUrl,
            // video: 'https://www.youtube.com/embed/xNRJwmlRBNU',
            description: record.description
          }
        })
        setListVideo(formatDataVideos);
        setTotalRecord(response.data.total)
      }
    })
  }, [page,size]);

  const handleTableChange = (page: any, size: any) => {
    setPage(page);
    setSize(size);
  };

  return (
    <>
      <List
        itemLayout="vertical"
        size="large"

        dataSource={listVideo}
        renderItem={(item : video) => (
          <List.Item
            key={item.title}
            extra={
              <div style={{display: 'flex', alignItems: 'center'}} className="w-100">
                <iframe
                  src={item.videoUrl}
                  title={item.title}
                  className="w-50"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{margin: '0 auto', display: 'block', height: '300px'}}
                ></iframe>
                <div className="information w-50" style={{ marginTop: '35px',marginLeft: '20px', overflow: 'auto', height: '350px', overflowBlock: 'auto'}}>
                  <h4>{item.title}</h4>
                  <div>{`Shared by: ${item.sharedBy}`}</div>
                  <div>Description:</div>
                  <div>
                    {item.description}
                  </div>
                </div>
              </div>
            }
          >
          </List.Item>
        )}
      />
      <PaginationCustom
        total={totalRecord}
        handleTableChange={handleTableChange}
        current={page}
        size={size}
      />
    </>

  );
};

export default Home;
