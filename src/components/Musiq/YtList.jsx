import React from 'react';
import { connect } from 'react-redux';
import { Input, List, Row, Col, Button } from 'antd';

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
            <div style={{ padding: 16 }}>
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
                            dataSource={props.ytItems}
                            renderItem={
                                (el) => (
                                    <List.Item>
                                        <Row justify="space-between" style={{ width: '100%'}}>
                                            <Col flex="1 1 auto">
                                                <a href={`https://youtube.com/watch?v=${el.videoId}`}
                                                    target="_blank" rel="noopener noreferrer"
                                                    title="Open song in youtube"
                                                >
                                                    <span>{el.title}</span>
                                                </a><br />
                                                <div className="mt-1">
                                                    <Button className="red" onClick={() => props.loadVideo(el.videoId)}>
                                                        <i className="fas fa-tv"></i>
                                                    </Button>
                                                    <Button className="red" onClick={() => loadVideoById(el.videoId)}>
                                                        <i className="fas fa-play"></i>
                                                    </Button>
                                                </div>
                                            </Col>
                                            <Col flex="0 0 120px">
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
