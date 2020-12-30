import React from 'react';
import { Button, Dropdown, Menu, Modal } from 'antd';

export function SongActionButtons(props) {
    const { songItem, removeSong } = props;
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

    function showRemoveConfirmation() {
        Modal.confirm({
            title: 'Do you want to remove that song:',
            icon: <i
                    style={{ float: 'left', fontSize: 21, color: '#faad14', marginRight: 16 }}
                    className="fas fa-exclamation-circle">
                </i>,
            content: songItem.title,
            onOk() {
                removeSong(songItem.id)
            },
            onCancel() {}
        });
    }

    const menu = (
        <Menu>
            <Menu.Item onClick={searchOnYoutube}>
                Find
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
            <Menu.Item onClick={props.editSong}>
                Edit
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item danger onClick={showRemoveConfirmation}>
                Remove
            </Menu.Item>
        </Menu>
    );

    return (
        <div>
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
