import React from 'react';
import { Button, Dropdown, Menu, Modal, Space } from 'antd';

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

    const menuItems = [
        {
            key: '0',
            label: (
                <div onClick={searchOnYoutube}>
                    Find
                </div>
            ),
        },
        {
            key: '1',
            label: (
                <a
                    href={"https://www.youtube.com/results?search_query=" + encodedTitle}
                    target="_blank" rel="noopener noreferrer"
                    title="Search song in youtube">
                    Search YT
                </a>
            ),
        },
        {
            key: '2',
            label: (
                <a
                    href={songItem.url}
                    className={songItem.url ? '' : ' disabled'}
                    target="_blank" rel="noopener noreferrer"
                    title="Open song in youtube">
                    Open in YT
                </a>
            ),
        },
        {
            key: '3',
            label: (
                <div onClick={props.editSong}>Edit</div>
            ),
        },
        {
            type: 'divider',
        },
        {
            key: '5',
            label: (
                <div onClick={showRemoveConfirmation}>
                    Remove
                </div>
            ),
            danger: true
        }
    ];

    return (
        <Space onClick={(e) => e.stopPropagation()}>
            <Button
                onClick={props.videoId ? () => props.loadVideo(props.videoId) : findAndLoadVideo}
                title="Play song on other devices">
                    <i className="fas fa-tv"></i>
            </Button>
            <Dropdown menu={{ items: menuItems }} placement="bottom" arrow trigger={["click"]}>
                <Button>
                    <i className="fas fa-ellipsis-v"></i>
                </Button>
            </Dropdown>
        </Space>
    );
}
