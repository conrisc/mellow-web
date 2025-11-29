import React, { useState } from 'react';
import { Row, Col, Button, Input, InputNumber, Select } from 'antd';
const { Option } = Select;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faTags } from '@fortawesome/free-solid-svg-icons';
import { NewSongModal } from './NewSongModal';

import './SongFilterPanel.css';


export function SongFilterPanel(props) {
    const { songFilters, setSongFilters, showTagsDrawer, addSong } = props;
    const [isNewSongModalVisible, setIsNewSongModalVisible] = useState(false);

    function handleTitleFilterChange(event) {
        const title = event.target.value;
        setSongFilters({
            ...songFilters,
            skip: 0,
            title
        });
    }

    function handleSkipFilterChange(value) {
        if (!isNaN(value)) {
            setSongFilters({
                ...songFilters,
                skip: Number(value)
            });
        }
    }

    function handleLimitFilterChange(value) {
        setSongFilters({
            ...songFilters,
            limit: Number(value)
        });
    }

    function handleSortFilterChange(sort) {
        setSongFilters({
            ...songFilters,
            skip: 0,
            sort
        });
    }

    return (
        <>
            <NewSongModal
                addSong={addSong}
                isOpen={isNewSongModalVisible}
                closeModal={() => setIsNewSongModalVisible(false)}
            />
            <Row
                justify="space-between"
                gutter={[8, 4]}
                className="filter-panel"
            >
                <Col lg={0}>
                    <Button onClick={showTagsDrawer} icon={<FontAwesomeIcon icon={faTags} />} />
                </Col>
                <Col flex="auto">
                    <Input
                        placeholder="Search song"
                        allowClear={true}
                        value={songFilters.title}
                        onChange={handleTitleFilterChange}
                        prefix={<FontAwesomeIcon icon={faSearch} />}
                    />
                </Col>
                <Col>
                    {/* Skip */}
                    <InputNumber
                        value={songFilters.skip}
                        onChange={handleSkipFilterChange}
                        min={0}
                        precision={0}
                    />
                </Col>
                <Col>
                    {/* Limit */}
                    <Select
                        value={songFilters.limit}
                        onChange={handleLimitFilterChange}>
                        <Option value={10}>10</Option>
                        <Option value={30}>30</Option>
                        <Option value={50}>50</Option>
                    </Select>
                </Col>
                <Col>
                    {/* Sort */}
                    <Select
                        style={{ width: 90}}
                        value={songFilters.sort}
                        onChange={handleSortFilterChange}
                    >
                        <Option value="added_date_desc">Latest</Option>
                        <Option value="added_date_asc">Oldest</Option>
                        <Option value="title_asc">Title Asc</Option>
                        <Option value="title_desc">Title Desc</Option>
                        <Option value="random">Random</Option>
                    </Select>
                </Col>
                <Col>
                    <Button onClick={() => setIsNewSongModalVisible(true)}
                        icon={<FontAwesomeIcon icon={faPlus} />}
                    />
                </Col>
            </Row>
        </>
    );
}
