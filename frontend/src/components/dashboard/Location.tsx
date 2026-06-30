import { useEffect, useState } from 'react';
import OrganizationCard from './OrganizationCard';
import { getLocations } from '../../service/location.service';
import { getPlants } from '../../service/plant.service';
import { resolveCardImage } from '../../utils/cardImage';

interface Location {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
}

interface Plant {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
}

type BreadcrumbItem = {
    label: string;
    view: 'location' | 'plant';
    locationId?: string;
};

function Location() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [plants, setPlants] = useState<Plant[]>([]);
    const [isLoadingLocations, setIsLoadingLocations] = useState(true);
    const [isLoadingPlants, setIsLoadingPlants] = useState(false);

    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
        { label: 'Location', view: 'location' },
    ]);

    const currentView = breadcrumbs[breadcrumbs.length - 1];

    useEffect(() => {
        const fetchLocations = async () => {
            setIsLoadingLocations(true);
            try {
                const res = await getLocations();
                setLocations(res.body?.data ?? []);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoadingLocations(false);
            }
        };
        fetchLocations();
    }, []);

    useEffect(() => {
        if (currentView.view !== 'plant' || !currentView.locationId) return;

        const fetchPlants = async () => {
            setIsLoadingPlants(true);
            try {
                const res = await getPlants({ locationId: currentView.locationId });
                setPlants(res.body?.data ?? []);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoadingPlants(false);
            }
        };

        fetchPlants();
    }, [currentView]);

    const handleLocationClick = (location: Location) => {
        setBreadcrumbs((prev) => [
            ...prev,
            {
                label: location.name,
                view: 'plant',
                locationId: location.id,
            },
        ]);
    };

    const handleBreadcrumbClick = (index: number) => {
        if (index === breadcrumbs.length - 1) return;
        setBreadcrumbs((prev) => prev.slice(0, index + 1));
        if (breadcrumbs[index].view === 'location') {
            setPlants([]);
        }
    };

    return (
        <div className="flex flex-col h-full p-4">
            <div className="flex-1 overflow-auto">

                <div className="flex flex-row flex-wrap items-center gap-1 h-auto bg-surface-card mb-2">
                    {breadcrumbs.map((crumb, index) => {
                        const isLast = index === breadcrumbs.length - 1;
                        const isFirst = index === 0;
                        return (
                            <span key={index} className="flex items-center">
                                <button
                                    onClick={() => handleBreadcrumbClick(index)}
                                    disabled={isLast}
                                    className={`text-lg font-medium transition-colors${isLast
                                        ? 'cursor-default'
                                        : 'hover:underline cursor-pointer'
                                        }
                                        ${isFirst
                                            ? 'text-text-primary'
                                            : 'text-brand-danger font-bold'
                                        }
                                `}
                                >
                                    {crumb.label}
                                </button>
                                {!isLast && (
                                    <span className="text-brand-danger mx-1 select-none">&gt;</span>
                                )}
                            </span>
                        );
                    })}
                </div>

                {currentView.view === 'location' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 py-4 w-full">
                        {isLoadingLocations && (
                            <div className="flex flex-col items-center justify-center h-full col-span-full">
                                <h2 className="text-lg font-medium text-text-heading">Loading locations...</h2>
                            </div>
                        )}
                        {!isLoadingLocations && locations.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full col-span-full">
                                <h2 className="text-lg font-medium text-text-heading">No locations found</h2>
                            </div>
                        )}
                        {!isLoadingLocations && locations.map((location) => (
                            <OrganizationCard
                                key={location.id}
                                name={location.name}
                                image={resolveCardImage(location.image, location.name)}
                                onclick={() => handleLocationClick(location)}
                            />
                        ))}
                    </div>
                )}

                {currentView.view === 'plant' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 py-4 w-full">
                        {isLoadingPlants && (
                            <div className="flex flex-col items-center justify-center h-full col-span-full">
                                <h2 className="text-lg font-medium text-text-heading">Loading plants...</h2>
                            </div>
                        )}
                        {!isLoadingPlants && plants.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full col-span-full">
                                <h2 className="text-lg font-medium text-text-heading">No plants found</h2>
                            </div>
                        )}
                        {!isLoadingPlants && plants.map((plant) => (
                            <OrganizationCard
                                key={plant.id}
                                name={plant.name}
                                image={resolveCardImage(plant.image, plant.name)}
                                onclick={() => {/* handle plant click if needed */ }}
                            />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

export default Location;
