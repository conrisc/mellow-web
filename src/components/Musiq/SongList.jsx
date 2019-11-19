import React from 'react';
import { debounce } from 'throttle-debounce';
import { DevelopersApi } from 'what_api';

import { SongActionButtons } from './SongActionButtons';
import { SongFilterPanel } from './SongFilterPanel';

export class SongList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            skip: 0,
            limit: 30,
            songs: []
        }
        this.getSongsDebounced = debounce(2000, () => this.getSongs())
    }

    componentDidMount() {
        const elems = document.querySelectorAll('select');
        M.FormSelect.init(elems, {});
        this.getSongs();
    }

    getSongs() {
        const api = new DevelopersApi();

        const opts = {
            skip: this.state.skip,
            limit: this.state.limit,
            tags:  this.props.tags.filter(tagElement => tagElement.selected).map(tagElement => tagElement.tagItem.id)
        };

        return api.searchSong(opts)
            .then(data => {
                this.setState({ songs: data })
            }, error => {
                // this.pushToast('Cound not get songs');
                console.error(error);
            });
    }

    render() {
        const tagsIdToNameMap = this.props.tags.reduce(
            (acc, tagElement) => { 
                acc[tagElement.tagItem.id] = tagElement.tagItem.name;
                return acc;
            }, 
        {});
        return (
            <div>
                <SongFilterPanel
                    skip={this.state.skip}
                    setSkip={skip => this.setState({skip})}
                    limit={this.state.limit}
                    setLimit={limit => this.setState({limit})}
                    getSongsDebounced={this.getSongsDebounced}
                />
                <ul className="collection">
                    {
                        this.state.songs.map((songItem, index) => {
                            const date = new Date(songItem.dateAdded).toGMTString();
                            return (
                                <li className="collection-item row" key={index}>
                                    <div className="col">
                                        <h6 className="bold">{songItem.title}</h6>
                                        {
                                            songItem.tags.map(tagId => <span key={tagId} className="tag-item">{tagsIdToNameMap[tagId]}</span>)
                                        }
                                        <p>
                                            <span className="small-text grey-text">{date}</span>
                                        </p>
                                    </div>
                                    <SongActionButtons 
                                        songItem={songItem}
                                        getYtItems={this.props.getYtItems}
                                        playVideo={this.props.playVideo}
                                    />
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        );
    }
}
