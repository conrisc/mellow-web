import React from 'react';
import { Button, Dropdown, Menu } from 'antd';

export function SongActionButtons(props) {
    const songItem = props.songItem;
    const encodedTitle = encodeURIComponent(songItem.title);

    function findAndLoadVideo() {
        props.getYtItems(songItem.title)
            .then(ytItems => {
                props.loadVideo(ytItems[0].videoId);
            })
    }

    function searchOnYoutube() {
        props.getYtItems(songItem.title);
        props.showYtTab();
    }

    const menu = (
        <Menu>
            <Menu.Item>
                <a href="#" onClick={searchOnYoutube}>Find</a>
            </Menu.Item>
            <Menu.Item>
                <a
                    href={"https://www.youtube.com/results?search_query=" + encodedTitle}
                    target="_blank" rel="noopener noreferrer"
                    title="Search song in youtube">
                    Search YT
                </a>
            </Menu.Item>
            <Menu.Item>
                <a
                    href={songItem.url}
                    className={songItem.url ? '' : ' disabled'}
                    target="_blank" rel="noopener noreferrer"
                    title="Open song in youtube">
                    Open in YT
                </a>
            </Menu.Item>
            <Menu.Item>
                <a href="#" style={{color: 'red'}} onClick={() => props.removeSong(songItem.id)}>Remove</a>
            </Menu.Item>
        </Menu>
    );

    return (
        <div className="col right right-text">
            <Button
                onClick={props.videoId ? () => props.loadVideo(props.videoId) : findAndLoadVideo}
                title="Play song on other devices">
                    <i className="fas fa-tv"></i>
            </Button>
            <Dropdown overlay={menu} placement="bottomCenter" arrow trigger={["click"]}>
                <Button>
                    <i className="fas fa-ellipsis-v"></i>
                </Button>
            </Dropdown>
        </div>
    );
}
