
exports.rxMedicinShowForHrDept = async (req, res, next) => {
    try {
        const result2 = await prisma.rxMediReForHoParent.findMany({
            where: {
                rxMediReceiveStatus: { in: [1, 2] }
            },
            include: {
                rxMediReForHoChild: true
            }
        })
        const result3 = await prisma.rxMediReForHoChild.findMany({
            where: {
                rxMediReceiveStatus: { in: [2] }
            },
            include: {
                rxMediReForHoParent: true
            }
        })
        const cnewArrray = []
        const cnewQty = []
        result3.forEach(element => {
            const crrray = element.rxMediReForHoParent.id;
            const cToQty = element.rxMediReForHoParent.totalMediQty;
            cnewArrray.push(`${crrray}`)
            cnewQty.push(`${cToQty}`)
            // return cnewArrray;
        });



        const concateaq = [...cnewArrray, ...cnewQty]
        const result4 = [...new Set(concateaq)]
        // console.log("new array", concateaq)
        console.log("new array", result4)
        // console.log("cnewQty", cnewQty)
        const newV = [...new Set(result3)];
        //console.log("newV", newV)
        //console.log("result3", result3)
        const gid = [];
        result2.forEach(function (obj, inde) {
            const gv = Object.values(obj)
            return gid.push(gv[0]);
        })
        const disChd = await prisma.rxMediReForHoChild.findMany({
            where: {
                rxMediReHoId: { in: gid },
                rxMediReceiveStatus: 2
            }
        })
        const did = [];
        disChd.forEach(function (obj, ind) {
            const didv = Object.values(obj)
            return did.push(didv[3]);
        })
        if (disChd != '') {
            const result1 = await prisma.rxMediReForHoParent.findMany({
                where: {
                    id: { in: did }
                }
            })
            const result = await prisma.rxMediReForHoChild.findMany({
                where: {
                    rxMediReceiveStatus: 2
                }
            })
            // console.log("result2", result2)
            res.send({ success: true, "message": "Show Successfully", result1, result, disChd, result2, result3, result4 })
        } else {
            res.send({ success: true, "message": "Not Found" })
        }
    } catch (error) {
        next(error);
    }
}

exports.rxMedicinShowForHrReceive = async (req, res, next) => {
    try {
        // console.log('count1', count1[0].totalMediQty);
        // console.log('medicineReceiveQty', count2[0]._sum.medicineReceiveQty);
        // if(count1[0].totalMediQty == count2[0]._sum.medicineReceiveQty) {
        // res.send({ success: true, "message": "Complete"})
        // }else{
        const result = await prisma.rxMediReForHoParent.findMany({
            where: {
                id: Number(req.params.id)
            },
            include: {
                rxMediReForHoChild: {
                    where: {
                        rxMediReHoId: Number(req.params.id),
                        rxMediReceiveStatus: 2
                    },
                }
            }
        })
        res.send({ success: true, "message": "Show Successfully", result })
        /*
        const result = await prisma.rxMediReForHoChild.groupBy({
        by: ['medicineName'],
        _sum: {
        totalMedicineQty: true,
        amount: true,
        medicineReceiveQty: true
        },
        where: {
        rxMediReHoId: Number(req.params.id)
        }
        })
        const result = await prisma.rxMediReForHoParent.findMany({
        where: {
        id: Number(req.params.id)
        },
        include: {
        rxMediReForHoChild: true
        }
        })
        
        
        
        const medicineReceive = await prisma.rxMediReForHoChild.groupBy({
        by: ['medicineName'],
        // by: ['prescriptionId'],
        _sum: {
        totalMedicineQty: true,
        amount: true,
        medicineReceiveQty: true
        },
        where: {
        rxMediReHoId: Number(req.params.id)
        }
        })
        const result = await prisma.rxMediReForHoChild.groupBy({
        by: ['medicineName'],
        _sum: {
        totalMedicineQty: true,
        amount: true,
        medicineReceiveQty: true
        },
        where: {
        rxMediReHoId: Number(req.params.id)
        }
        })
        const resultBack = await prisma.rxMediReForHoParent.findMany({
        where: {
        id: Number(req.params.id)
        },
        include: {
        rxMediReForHoChild: true
        }
        })
        */
    } catch (error) {
        next(error);
    }
}

exports.mediReceiveByHROffice = async (req, res, next) => {
    try {
        const { medicineReceiveList, multipleId, amount, medicineReceiveQty } = req.body;



        /*
        const ids = [];
        medicineReceiveList.forEach(function(obj, index) {
        const idValue = Object.values(obj);
        console.log("id value",idValue);
        ids.push(idValue[0]);
        })
        const mqty = [];
        medicineReceiveList.forEach(function(obj, index) {
        const idValue = Object.values(obj);
        console.log("id value",idValue);
        mqty.push(idValue[1]);
        })
        const qty = 10
        const mycon = [10.11]
        const dataList = [
        {where: {ids}, data: {medicineReceiveQty: mqty}},
        ];
        const dataList2 = [
        {where: {id:71}, data: {medicineReceiveQty: 20}},
        {where: {id:71}, data: {medicineReceiveQty: 21}},
        ];
        
        
        
        // const result = await (dataList.map((data) => prisma.rxMediReForHoChild.update(data)));
        const setValue = [];
        dataList.map((a, b) => {
        const sValue = Object.values(a);
        // console.log("bbb", Object.values(a))
        setValue.push(sValue[1]);
        })
        */
        // const id = [326,329]
        // console.log("id", id)
        //console.log("req.body.rxMediChdId", req.body.rxMediChdId)
        const getId = req.body.rxMediChdId
        const result = await prisma.rxMediReForHoChild.updateMany({
            where: {
                id: { in: req.body.rxMediChdId }
            },
            data: {
                // medicineReceiveQty: medicineReceiveQty,
                // amount,
                rxMediReceiveStatus: 3,
                medicineReceiveBy: 1,
                medicineReceiveDate: new Date().toLocaleDateString(),
                medicineReceiveTime: new Date().toLocaleTimeString()
            }
        })



        console.log("suma")
        const totalDelivery = await prisma.rxMediReForHoChild.findFirst({
            where: {
                id: { in: getId }
            },
        })
        const getToDel = totalDelivery.rxMediReHoId;
        // console.log("totalDelivery", totalDelivery)
        //console.log("getToDel", getToDel)
        const totalQty = await prisma.rxMediReForHoParent.findFirst({
            where: {
                id: getToDel
            },
            select: {
                totalMediQty: true
            }
        })
        console.log("sum b")
        const totalDeli = await prisma.rxMediReForHoChild.groupBy({
            where: {
                rxMediReHoId: getToDel,
                rxMediReceiveStatus: 3
            },
            by: ['rxMediReHoId'],
            _sum: {
                totalMedicineQty: true
            }
        })
        console.log("sum", totalDeli)
        const sumTotalQty = totalQty.totalMediQty;
        const sumtotalDeli = totalDeli[0]._sum.totalMedicineQty;
        console.log("sumTotalQty", sumTotalQty)
        console.log("sumtotal Delivery", sumtotalDeli)
        if (sumTotalQty === sumtotalDeli) {
            const resultUp = await prisma.rxMediReForHoParent.update({
                where: {
                    id: getToDel
                },
                data: {
                    rxMediReceiveStatus: 3
                }
            })
        }
        res.send({ success: true, "message": "Insert Successfully", result, totalDelivery })
    } catch (error) {
        next(error);
    }
}


exports.medicineDistributionList = async (req, res, next) => {
    try {
        const getId = await prisma.rxMediReForHoParent.findMany({
            where: { rxMediReceiveStatus: { in: [2, 3] } }
        })
        const getId2 = await prisma.rxMediReForHoChild.findMany({
            where: { rxMediReceiveStatus: { in: [3] } }
        })
        console.log("getId2", getId2)
        console.log("getId", getId)
        const idv = [];
        getId2.forEach(function (obj, ind) {
            const idvs = Object.values(obj)
            return idv.push(idvs[4]);
        })
        const idExist = await prisma.rxMediReForHoChild.findMany({
            where: {
                rxMediReHoId: { in: idv },
                rxMediReceiveStatus: 3,
                NOT: {
                    rxMediDelieryStatus: 2
                }
            }
        })
        // console.log("idExist", idExist)
        const idexistv = [];
        idExist.forEach(function (obj, ind) {
            const idexitvalueSet = Object.values(obj);
            return idexistv.push(idexitvalueSet[4]);
        })
        // console.log("idexistv", idexistv)
        if (idExist != '') {
            const result = await prisma.rxMediReForHoParent.findMany({
                where: {
                    id: { in: idexistv },
                }
            })
            console.log("result", result)
            res.send({ success: true, "message": "Show successfully", result })
        } else {
            res.send({ success: true, "message": "Not Found" })
        }
    } catch (error) {
        next(error)
    }
}

exports.medicineDistributionById = async (req, res, next) => {
    try {
        // console.log("req.params.id", req.params.id)
        const resultNew = await prisma.rxMediReForHoChild.findMany({
            where: {
                rxMediReHoId: Number(req.params.id),
                rxMediReceiveStatus: 3
            }
        })
        // console.log("id", req.params.id)
        const preId = []
        resultNew.map((object, index) => {
            const iValue = Object.values(object);
            // console.log("Ival ue",iValue);
            preId.push(iValue[6])
        })
        // console.log("ddd", preId)
        const presId = [resultNew.prescriptionId];
        // console.log("ssssssssss",presId)
        const newPatientName = await prisma.presGenerateParent.findMany({
            where: {
                id: { in: preId }
            }
        })
        const result = await prisma.rxMediReForHoParent.findMany({
            where: {
                id: Number(req.params.id)
            },
            include: {
                rxApproveParents: true
            },
            include: {
                rxMediReForHoParent: true
            },
            include: {
                rxMediReForHoChild: {
                    where: {
                        rxMediReceiveStatus: 3,
                        NOT: {
                            rxMediDelieryStatus: 2
                        }
                    }
                },
            }
        })
        // console.log("resultNew", result)
        const patientName = await prisma.presGenerateParent.findMany({
            where: {
                id: result[0].rxMediReForHoChild[0].prescriptionId
            }
        })
        // const mergeData = Object.assign(patientName, result);
        const contcatea = result.concat(patientName);
        res.send({ success: true, "message": "Show successfully", resultNew, newPatientName, patientName, result, contcatea })
    } catch (error) {
        next(error)
    }
}

exports.medicineDelivery = async (req, res, next) => {
    try {
        // console.log("ddddddddddd", req.user.id);
        const { rxMediPaidStatus, amount, rxMediDelieryStatus } = req.body;
        // console.log("amount",req.body.paidAmount)
        const result = await prisma.rxMediReForHoChild.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                rxMediPaidStatus,
                amount,
                rxMediDelieryStatus,
                mediDeliveryDate: new Date().toLocaleDateString(),
                mediDeliveryTime: new Date().toLocaleTimeString(),
                mediDeliveryBy: Number(req.user.id)
            }
        })
        res.send({ success: true, "message": "Insert successfully", result })
    } catch (error) {
        next(error)
    }
}
/*
exports.medicineDelivery = async(req, res, next) => {
try {
const {rxMediReHoId,rxMediPaidStatus,paidAmount,rxDeliveryList} = req.body;
console.log("amount",req.body.paidAmount)
const result = await prisma.medicineDeliveryParent.create({
data: {
rxMediReHoId,
rxMediPaidStatus,
paidAmount,
mediDeliveryDate: new Date().toLocaleDateString(),
mediDeliveryTime: new Date().toLocaleTimeString(),
orgId: 1,
medicineDeliveryChild: { create: rxDeliveryList}
}
})
res.send({ success: true, "message": "Insert successfully", result})
} catch (error) {
next(error)
}
}*/


----------------- order route.js----------
    const express = require('express')
// const auth = require('../middlewares/IsLoggedin')
const authCheck = require('../middlewares/Authenticate')
const {
    getMedicineOrderList,
    getDetailsByMedicine,
    rxMedicinForHO
} = require('../controller/OrderController')
const router = express.Router();
router.route('/getMedicineOrderList').get(authCheck, getMedicineOrderList)
router.route('/getDetailsByMedicine/:udProductCode').get(getDetailsByMedicine)
router.route('/rxMedicinForHO').post(authCheck, rxMedicinForHO)
module.exports = router

----------prescription-------

    const prisma = require('../../prisma/index')
const path = require('path')
const multer = require('multer')
const uploadImage = require('../helper/Upload')
/* get all medicine without approved medicine*/
exports.getAll = async (req, res, next) => {
    try {
        // session=req.session
        // console.log("ssss", req.user)
        const totalPrescription = await prisma.presGenerateParent.aggregate({
            where: {
                prescriptionStatus: 0,
                activeStatus: 1,
                orgId: req.user.orgId,
                NOT: {
                    completeStatus: 2,
                }
            },
            _count: {
                id: true
            }
        })
        let result = await prisma.presGenerateParent.findMany({
            where: {
                prescriptionStatus: 0,
                activeStatus: 1,
                orgId: req.user.orgId,
                NOT: {
                    completeStatus: 2,
                }
            },
            include: {
                presGenerateChild: {
                    where: {
                        NOT: {
                            prescMediAppStatus: 2
                        }
                    }
                }
            },
            include: {
                presImage: true
            }
        })
        res.json({ success: true, "message": "Show successfully", totalPrescription, result })
    } catch (error) {
        next(error)
    }
}
exports.getPrescriptionById = async (req, res, next) => {
    try {
        const totalMedicineCount = await prisma.presGenerateChild.groupBy({
            by: ['prescriptionId'],
            where: {
                prescriptionId: Number(req.params.id),
                NOT: {
                    prescMediAppStatus: 2
                }
            },
            _count: {
                id: true
            }
        })
        let resultValue = await prisma.presGenerateParent.findMany({
            where: {
                id: Number(req.params.id),
                NOT: {
                    completeStatus: 2,
                }
            },
            include: {
                presGenerateChild: {
                    where: {
                        NOT: {
                            prescMediAppStatus: 2
                        }
                    }
                },
                presImage: true
            }
        })
        const [result] = resultValue;
        const [totalMedicine] = totalMedicineCount;
        res.json({ success: true, "message": "Show successfully", totalMedicine, result })
    } catch (error) {
        next(error)
    }
}
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/upload');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // console.log('In File Filter');
        let ext = path.extname(file.originalname);
        if (ext == '.jpg' || ext == '.png' || ext == '.gif' || ext == '.jpeg') {
            cb(null, true);
        }
        else {
            cb('Only Images Are Allow', false);
        }
    }
})

exports.createPrescription = async (req, res, next) => {
    console.log("outside")
    try {
        console.log("inside")
        let { empOldId, empName, requestFor, relationReqEmp, remarks, requestNo, prescriptionGenDate, presImageList, medicineDeliveryDate, presGenerateChildList } = req.body;
        const url = req.protocol + "://" + req.get("host");
        console.log("prescription data", req.body)
        let result = await prisma.presGenerateParent.create({
            data: {
                empOldId,
                empName,
                requestFor,
                relationReqEmp,
                remarks,
                requestNo,
                prescriptionGenDate: new Date(prescriptionGenDate).toLocaleDateString(),
                prescriptionGenTime: new Date().toLocaleTimeString(),
                medicineDeliveryDate: new Date(medicineDeliveryDate).toLocaleDateString(),
                // prescriptionImage: url+"/public/"+req.file.filename,
                facilitiesType: 1,
                prescriptionStatus: 0,
                presGenUrlStatus: 2,
                orgId: req.user.orgId,
                presImage: {
                    create: presImageList
                },
                presGenerateChild: {
                    create: presGenerateChildList
                }
            }
        })
        res.json({ success: true, "message": "Save Successfully", result })
    } catch (error) {
        next(error)
    }
}
exports.update = async (req, res, next) => {
    try {
        let { empOldId, empName, prescriptionGenDate, prescriptionImage, activeStatus, presGenerateChildList } = req.body;
        let data = await prisma.presGenerateParent.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                empOldId,
                empName,
                prescriptionGenDate: new Date(prescriptionGenDate),
                prescriptionImage,
                facilitiesType: 1,
                prescriptionStatus: 0,
                activeStatus: 1,
                updatedBy: req.user.id,
                presGenerateChild: {
                    create: presGenerateChildList
                }
            }
        })
        res.json({ success: true, "message": "Update Successfully", data })
    } catch (error) {
        next(error)
    }
}
exports.prescriptionApprove = async (req, res, next) => {
    try {
        let data = await prisma.presGenerateParent.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                prescriptionStatus: 1,
                prescriptionApproveDate: new Date().toLocaleDateString(),
                prescriptionApproveTime: new Date().toLocaleTimeString(),
                prescriptionApprovedBy: 1
            }
        })
        res.json({ success: true, "message": "Approve Successfully", data })
    } catch (error) {
        next(error)
    }
}

exports.prescriptionApproveById = async (req, res, next) => {
    try {
        const completeMedicine = await prisma.presGenerateParent.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                completeStatus: req.body.completeStatus
            }
        })
        const result = await prisma.presGenerateChild.updateMany({
            where: {
                id: {
                    in: req.body.medicinedChdId
                }
            },
            data: {
                prescMediAppStatus: 2,
                orgId: req.user.orgId,
                createdBy: req.user.id,
                completeStatus: req.body.completeStatus,
                presApproveAt: new Date().toLocaleDateString(),
                presApproveTime: new Date().toLocaleTimeString(),
                presApprovedBy: req.user.id
            }
        })
        res.json({ success: true, "message": "Approve Successfully", result })
    } catch (error) {
        next(error)
    }
}



exports.prescriptionApproveByAti = async (req, res, next) => {
    try {
        let result = await prisma.presGenerateParent.findMany({
            where: {
                prescriptionStatus: 1,
                activeStatus: 1
            },
            include: {
                presGenerateChild: true
            }
        })
        res.json({ success: true, "message": "Show successfully", result })
    } catch (error) {
        next(error)
    }
}


exports.getAppvedMedListAfterReview = async (req, res, next) => {
    try {
        //group by
        const presId = await prisma.presGenerateChild.groupBy({
            by: ['prescriptionId'],
            where: {
                prescMediAppStatus: 2
            }
        })
        //get only value from array
        const mapToArray = (presId = []) => {
            const res = [];
            presId.forEach(function (obj, index) {
                const key = Object.keys(obj);
                const value = parseInt(key, 10);
                res.push(obj[key]);
            });
            return res;
        };
        const gnValue = mapToArray(presId)
        //get id from object
        const patientId = [gnValue];
        const cPatientId = patientId.pop();
        const result = await prisma.presGenerateParent.findMany({
            where: {
                id: { in: cPatientId },
                NOT: {
                    prescriptionStatus: 2
                }
            }
        })
        const totalPrescription = await prisma.presGenerateParent.aggregate({
            where: {
                id: { in: cPatientId }
            },
            _count: {
                id: true
            }
        })
        res.send({ success: true, "message": "Show Successfully", totalPrescription, result })
    } catch (error) {
        next(error)
    }
}



exports.getAppvedMedListAfterReviewById = async (req, res, next) => {
    try {
        const totalMedicine = await prisma.presGenerateChild.aggregate({
            _count: {
                prescriptionId: true
            },
            where: {
                prescriptionId: Number(req.params.id),
                prescMediAppStatus: 2
            }



        })
        const resultShow = await prisma.presGenerateParent.findMany({
            where: {
                id: Number(req.params.id)
            },
            include: {
                presGenerateChild: {
                    where: {
                        prescMediAppStatus: 2
                    },
                    select: {
                        id: true,
                        prescriptionId: true,
                        udProductCode: true,
                        medicineName: true,
                        medicineQty: true,
                        prescMediAppStatus: true,
                        presApproveAt: true,
                        presApproveTime: true,
                    }
                },
                presImage: true
            }
        })
        const [result] = resultShow;
        res.send({ success: true, "message": "Show Successfully", totalMedicine, result })
    } catch (error) {
        next(error)
    }
}



exports.prescriptionApproveByHeadOffice = async (req, res, next) => {
    try {
        let data = await prisma.presGenerateParent.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                prescriptionStatus: 2,
                prescriptionApproveHOAt: new Date(),
                prescriptionApprovedByHO: 1
            }
        })
        res.json({ success: true, "message": "Approve Successfully", data })
    } catch (error) {
        next(error)
    }
}
exports.deleteSession = async (req, res, next) => {
    try {
        let data = await prisma.presGenerateParent.delete({
            where: {
                id: req.params.id
            }
        })
        res.json({ success: true, "message": "Delete Successfully", data })
    } catch (error) {
        next(error)
    }
}

