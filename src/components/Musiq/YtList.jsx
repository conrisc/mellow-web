import React from 'react';
import { connect } from 'react-redux';
import { Input, List, Row, Col, Button, Space } from 'antd';

import { YtPlayer } from './YtPlayer';
import { Spinner } from 'CommonComponents/Spinner';

function YtListX(props) {
    const { ytPlayer } = props;

    function loadVideoById(videoId) {
        ytPlayer.loadVideoById(videoId)
    }

    function handleSearchChange(event) {
        const title = event.target.value;
        props.getYtItemsDebounced(title);
    }

    return (
        <div className="yt-list side-bar">
            <YtPlayer />
            <div style={{ padding: 12 }}>
                <Input
                    className="yt-search"
                    allowClear={true}
                    onChange={handleSearchChange}
                    prefix={<i className="fas fa-search"></i>}
                    placeholder="Search youtube"
                />
                {
                    props.isFetchingYtItems ?
                        <div className="center-align">
                            <Spinner />
                        </div>
                    :
                        <List
                            rowKey="key"
                            size="small"
                            dataSource={props.ytItems}
                            renderItem={
                                (el) => (
                                    <List.Item className="f-size-medium" style={{ borderBottom: '1px solid #555959'}}>
                                        <Row justify="space-between" style={{ width: '100%', flexWrap: 'nowrap' }}>
                                            <Col flex="1 1 auto" style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                <a href={`https://youtube.com/watch?v=${el.videoId}`}
                                                    target="_blank" rel="noopener noreferrer"
                                                    title="Open song in youtube"
                                                >
                                                    <h4 style={{ color: '#ececec', marginRight: '1em', overflow: 'hidden', textOverflow: 'ellipsis' }}>{el.title}</h4>
                                                </a>
                                                <Space className="mt-1">
                                                    <Button onClick={() => props.loadVideo(el.videoId)}>
                                                        <i className="fas fa-tv"></i>
                                                    </Button>
                                                    <Button type="primary" onClick={() => loadVideoById(el.videoId)}>
                                                        <i className="fas fa-play"></i>
                                                    </Button>
                                                </Space>
                                            </Col>
                                            <Col className="yt-image">
                                                <img src={`https://i.ytimg.com/vi/${el.videoId}/default.jpg`}></img>
                                                {/* <img src={el.thumbnailUrl}></img> */}
                                            </Col>
                                        </Row>
                                    </List.Item>
                                )

                            }
                        />
                }
            </div>
        </div>
    );
}
const mapStateToProps = state => {
    return {
        ytPlayer: state.ytPlayer
    };
}

const mapDispatchToProps = dispatch => {
    return {};
}

export const YtList = connect(mapStateToProps, mapDispatchToProps)(YtListX);
